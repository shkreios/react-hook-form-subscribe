import { act, fireEvent, render, renderHook, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useForm } from 'react-hook-form';
import { describe, expect, it, vi } from 'vitest';
import { useCreateTrackedFormSubscribe } from './useCreateTrackedFormSubscribe';

describe('useCreateTrackedFormSubscribe hook', () => {
  it('should call the callback when the form field value changes', async () => {
    const callback = vi.fn().mockImplementation(({ firstname }) => {});
    const {
      result: {
        current: { register, control },
      },
    } = renderHook(() => useForm());

    const {
      result: { current: useTrackedFormSubscribe },
    } = renderHook(() => useCreateTrackedFormSubscribe(control));

    renderHook(() => useTrackedFormSubscribe(callback));

    render(
      <div>
        <input placeholder="Firstname" {...register('firstname')} />
      </div>
    );

    await userEvent.type(screen.getByPlaceholderText('Firstname'), 'John');

    expect(callback).toHaveBeenCalledTimes(4);
    expect(callback).toHaveBeenLastCalledWith(
      { firstname: 'John' },
      { name: 'firstname', type: 'change', values: { firstname: 'John' } }
    );
  });

  it('should call the callback when any of the form fields specified in the array change', async () => {
    const callback = vi.fn().mockImplementation(({ firstname, lastname }) => {});
    const {
      result: {
        current: { register, control },
      },
    } = renderHook(() => useForm());

    const {
      result: { current: useTrackedFormSubscribe },
    } = renderHook(() => useCreateTrackedFormSubscribe(control));

    renderHook(() => useTrackedFormSubscribe(callback));

    render(
      <div>
        <input placeholder="Firstname" {...register('firstname')} />
        <input placeholder="Lastname" {...register('lastname')} />
      </div>
    );

    await userEvent.type(screen.getByPlaceholderText('Firstname'), 'John');

    expect(callback).toHaveBeenCalledTimes(4);
    expect(callback).toHaveBeenLastCalledWith(
      {
        firstname: 'John',
        lastname: '',
      },
      {
        name: 'firstname',
        type: 'change',
        values: {
          firstname: 'John',
          lastname: '',
        },
      }
    );

    await userEvent.type(screen.getByPlaceholderText('Lastname'), 'Doe');

    expect(callback).toHaveBeenCalledTimes(7);
    expect(callback).toHaveBeenLastCalledWith(
      {
        firstname: 'John',
        lastname: 'Doe',
      },
      {
        name: 'lastname',
        type: 'change',
        values: {
          firstname: 'John',
          lastname: 'Doe',
        },
      }
    );
  });
  it('should not call the callback when the component rerenders', () => {
    const callback = vi.fn().mockImplementation(({ firstname }) => {});
    const { result, rerender } = renderHook(() => useForm());
    const form = result.current;

    const {
      result: { current: useTrackedFormSubscribe },
    } = renderHook(() => useCreateTrackedFormSubscribe(form.control));

    renderHook(() => useTrackedFormSubscribe(callback));

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
      const useTrackedFormSubscribe = useCreateTrackedFormSubscribe(control);
      return { control, register, useTrackedFormSubscribe };
    });

    const { control, register, useTrackedFormSubscribe } = result.current;

    const callback = vi.fn().mockImplementation(({ firstname }) => {});
    render(
      <div>
        <input placeholder="First Name" {...register('firstname')} />
      </div>
    );

    expect(control._subjects.values.observers.length).toBe(0);

    renderHook(() => useTrackedFormSubscribe(callback));

    expect(control._subjects.values.observers.length).toBe(1);

    act(() => unmount());

    waitFor(() => expect(control._subjects.values.observers.length).toBe(0));
  });

  it('should only call the callback for the specified field when the form field value changes', () => {
    const { result } = renderHook(() => {
      const { control, register } = useForm();
      const useTrackedFormSubscribe = useCreateTrackedFormSubscribe(control);
      return { register, useTrackedFormSubscribe };
    });

    const { register, useTrackedFormSubscribe } = result.current;

    const callback = vi.fn().mockImplementation(({ firstname }) => {});
    render(
      <div>
        <input placeholder="First Name" {...register('firstname')} />
        <input placeholder="Last Name" {...register('lastname')} />
      </div>
    );

    renderHook(() => useTrackedFormSubscribe(({ firstname }) => callback({ firstname })));

    // no field has changed yet
    expect(callback).not.toHaveBeenCalled();

    act(() => {
      fireEvent.input(screen.getByPlaceholderText('Last Name'), {
        target: { value: 'Doe' },
      });
    });

    // callback is currently not tracked and therfore will be called once to evaluate the proxy
    expect(callback).toHaveBeenCalledTimes(1);

    act(() => {
      fireEvent.input(screen.getByPlaceholderText('Last Name'), {
        target: { value: 'Smith' },
      });
    });

    // A second time changing the lastname will not trigger the callback, since it is now tracked and will only be called when firstname changes
    expect(callback).toHaveBeenCalledTimes(1);

    act(() => {
      fireEvent.input(screen.getByPlaceholderText('First Name'), {
        target: { value: 'John' },
      });
    });

    // firstname has changed and the callback will be called
    expect(callback).toHaveBeenCalledTimes(2);

    act(() => {
      fireEvent.input(screen.getByPlaceholderText('Last Name'), {
        target: { value: 'Smith' },
      });
    });

    expect(callback).toHaveBeenCalledTimes(2);
  });

  it('should call the callback for all specified fields when any of the form fields change', () => {
    const { result } = renderHook(() => {
      const { control, register } = useForm();
      const useTrackedFormSubscribe = useCreateTrackedFormSubscribe(control);
      return { control, register, useTrackedFormSubscribe };
    });

    const { control, register, useTrackedFormSubscribe } = result.current;

    const callback = vi.fn().mockImplementation(({ firstname, lastname }) => {});
    render(
      <div>
        <input placeholder="First Name" {...register('firstname')} />
        <input placeholder="Last Name" {...register('lastname')} />
      </div>
    );

    renderHook(() => useTrackedFormSubscribe(callback));

    expect(callback).not.toHaveBeenCalled();

    act(() => {
      fireEvent.input(screen.getByPlaceholderText('First Name'), {
        target: { value: 'John' },
      });
    });

    expect(callback).toHaveBeenCalledTimes(1);
    expect(callback).toHaveBeenLastCalledWith(
      { firstname: 'John', lastname: '' },
      { name: 'firstname', type: 'change', values: { firstname: 'John', lastname: '' } }
    );
  });
});
