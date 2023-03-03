/* eslint-disable @typescript-eslint/ban-ts-comment */
import { useCallback, useRef, useEffect } from 'react';
import { FieldValues, Control, EventType } from 'react-hook-form';
import useEvent from 'react-use-event-hook';

const getProto = Object.getPrototypeOf;

const isObject = <T>(obj: T): obj is T extends object ? T : never =>
  obj && typeof obj === 'object' && getProto(obj) === Object.prototype;

function createProxy<T extends object>(parentPath: string, fields: string[], obj: T): T {
  return new Proxy(obj, {
    get(target, prop, receiver) {
      const fullPropName = parentPath ? `${parentPath}.${prop.toString()}` : prop.toString();
      if (!fields.includes(fullPropName)) {
        fields.push(fullPropName);
      }
      const val = Reflect.get(target, prop, receiver);
      if (isObject(val)) {
        return createProxy(fullPropName, fields, val);
      }
      return val;
    },
  }) as T;
}

const getValues = <TFieldValues extends FieldValues = FieldValues>(
  control: Control<TFieldValues>
) => ({
  ...control._defaultValues,
  ...(control._stateFlags.mount ? control._formValues : {}),
});

let warnedOnce = false;

export const useCreateTrackedFormSubscribe = <TFieldValues extends FieldValues = FieldValues>(
  control: Control<TFieldValues>
) => {
  if (!warnedOnce) {
    console.warn(
      [
        'react-hook-form-subscribe: useCreateTrackedFormSubscribe is still experimental and subject to change.',
        '',
        'You should use useFormSubscribe for now.',
      ].join('\n')
    );

    warnedOnce = true;
  }
  const useTrackedFormSubscribe = useCallback(
    <
      TCallback extends (
        value: TFieldValues,
        payload: {
          name?: string;
          type?: EventType;
          values?: FieldValues;
        }
      ) => void
    >(
      callback: TCallback
    ) => {
      const stableCallback = useEvent(callback);

      const fields = useRef<string[] | undefined>(undefined);

      const fn = useCallback<TCallback>(
        // @ts-ignore
        (value, payload) => {
          if (fields.current) {
            return stableCallback(value, payload);
          }
          fields.current = [];
          return stableCallback(createProxy('', fields.current, value), payload);
        },
        [stableCallback]
      );

      useEffect(() => {
        const subject =
          // @ts-expect-error
          control._subjects.values ?? (control._subjects.watch as typeof control._subjects.values);

        return subject.subscribe({
          next: (payload) => {
            if (payload.name && (!fields.current || fields.current?.includes(payload.name))) {
              // @ts-ignore
              fn(getValues(control), payload);
            }
          },
        }).unsubscribe;
        // eslint-disable-next-line react-hooks/exhaustive-deps
      }, [control, fn]);
    },
    [control]
  );

  return useTrackedFormSubscribe;
};
