import { act, fireEvent, render, renderHook, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useForm } from 'react-hook-form';
import { describe, expect, it, vi } from 'vitest';
import { useCreateFormSubscribe } from './useCreateFormSubscribe';

describe('useCreateFormSubscribe hook', () => {
  it('should call the callback when the form field value changes', async () => {
    const callback = vi.fn();
    const {
      result: {
        current: { register, control },
      },
    } = renderHook(() => useForm());

    const {
      result: { current: useFormSubscribe },
    } = renderHook(() => useCreateFormSubscribe(control));

    renderHook(() => useFormSubscribe('firstname', callback));

    render(
      <div>
        <input placeholder="Firstname" {...register('firstname')} />
      </div>
    );

    await userEvent.type(screen.getByPlaceholderText('Firstname'), 'John');

    expect(callback).toHaveBeenCalledTimes(4);
    expect(callback).toHaveBeenCalledWith('John', { name: 'firstname', type: 'change' });
  });

  it('should call the callback when any of the form fields specified in the array change', async () => {
    const callback = vi.fn();
    const {
      result: {
        current: { register, control },
      },
    } = renderHook(() => useForm());

    const {
      result: { current: useFormSubscribe },
    } = renderHook(() => useCreateFormSubscribe(control));

    renderHook(() => useFormSubscribe(['firstname', 'lastname'], callback));

    render(
      <div>
        <input placeholder="Firstname" {...register('firstname')} />
        <input placeholder="Lastname" {...register('lastname')} />
      </div>
    );

    await userEvent.type(screen.getByPlaceholderText('Firstname'), 'John');

    expect(callback).toHaveBeenCalledTimes(4);
    expect(callback).toHaveBeenCalledWith(['John', ''], { name: 'firstname', type: 'change' });

    await userEvent.type(screen.getByPlaceholderText('Lastname'), 'Doe');

    expect(callback).toHaveBeenCalledTimes(7);
    expect(callback).toHaveBeenLastCalledWith(['John', 'Doe'], {
      name: 'lastname',
      type: 'change',
    });
  });
  it('should not call the callback when the component rerenders', () => {
    const callback = vi.fn();
    const { result, rerender } = renderHook(() => useForm());
    const form = result.current;

    const {
      result: { current: useFormSubscribe },
    } = renderHook(() => useCreateFormSubscribe(form.control));

    renderHook(() => useFormSubscribe('firstname', callback));

    render(
      <div>
        <input placeholder="Firstname" {...form.register('firstname')} />
      </div>
    );

    fireEvent.input(screen.getByPlaceholderText('Firstname'), {
      target: { value: 'John' },
    });

    expect(callback).toHaveBeenCalledTimes(1);

    rerender();

    expect(callback).toHaveBeenCalledTimes(1);
  });

  it('should unsubscribe from the subject when unmounted', () => {
    const { result, unmount } = renderHook(() => {
      const { control, register } = useForm();
      const useFormSubscribe = useCreateFormSubscribe(control);
      return { control, register, useFormSubscribe };
    });

    const { control, register, useFormSubscribe } = result.current;

    const callback = vi.fn();
    render(
      <div>
        <input placeholder="First Name" {...register('firstName')} />
      </div>
    );

    expect(control._subjects.watch.observers.length).toBe(0);

    renderHook(() => useFormSubscribe('firstName', callback));

    expect(control._subjects.watch.observers.length).toBe(1);

    act(() => unmount());

    waitFor(() => expect(control._subjects.watch.observers.length).toBe(0));
  });

  it('should only call the callback for the specified field when the form field value changes', () => {
    const { result } = renderHook(() => {
      const { control, register } = useForm();
      const useFormSubscribe = useCreateFormSubscribe(control);
      return { control, register, useFormSubscribe };
    });

    const { control, register, useFormSubscribe } = result.current;

    const callback = vi.fn();
    render(
      <div>
        <input placeholder="First Name" {...register('firstName')} />
        <input placeholder="Last Name" {...register('lastName')} />
      </div>
    );

    renderHook(() => useFormSubscribe('firstName', callback));

    expect(callback).not.toHaveBeenCalled();

    act(() => {
      fireEvent.input(screen.getByPlaceholderText('Last Name'), {
        target: { value: 'Doe' },
      });
    });

    expect(callback).not.toHaveBeenCalled();

    act(() => {
      fireEvent.input(screen.getByPlaceholderText('First Name'), {
        target: { value: 'John' },
      });
    });

    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback).toHaveBeenCalledWith('John', { name: 'firstName', type: 'change' });

    act(() => {
      fireEvent.input(screen.getByPlaceholderText('Last Name'), {
        target: { value: 'Smith' },
      });
    });

    expect(callback).toHaveBeenCalledTimes(1);
  });

  it('should call the callback for all specified fields when any of the form fields change', () => {
    const { result } = renderHook(() => {
      const { control, register } = useForm();
      const useFormSubscribe = useCreateFormSubscribe(control);
      return { control, register, useFormSubscribe };
    });

    const { control, register, useFormSubscribe } = result.current;

    const callback = vi.fn();
    render(
      <div>
        <input placeholder="First Name" {...register('firstName')} />
        <input placeholder="Last Name" {...register('lastName')} />
      </div>
    );

    renderHook(() => useFormSubscribe(['firstName', 'lastName'], callback));

    expect(callback).not.toHaveBeenCalled();

    act(() => {
      fireEvent.input(screen.getByPlaceholderText('First Name'), {
        target: { value: 'John' },
      });
    });

    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback).toHaveBeenCalledWith(['John', ''], { name: 'firstName', type: 'change' });
  });
});
