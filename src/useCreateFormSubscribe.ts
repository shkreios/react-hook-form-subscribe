/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable react-hooks/rules-of-hooks */
import { StartsWith, startsWith } from './utils/startsWith';
import { useCallback, useEffect, useMemo } from 'react';
import type {
  Control,
  EventType,
  FieldPath,
  FieldPathValue,
  FieldPathValues,
  FieldValues,
} from 'react-hook-form';
import useEvent from 'react-use-event-hook';

export type UseFormSubscribeHook<TFieldValues extends FieldValues = FieldValues> = {
  <
    TFieldNames extends readonly FieldPath<TFieldValues>[],
    TCallback extends (
      value: FieldPathValues<TFieldValues, TFieldNames>,
      payload: {
        name?: StartsWith<FieldPath<TFieldValues>, TFieldNames[number]>;
        type?: EventType;
        values?: FieldValues;
      }
    ) => void
  >(
    names: readonly [...TFieldNames],
    callback: TCallback
  ): void;

  <
    TFieldName extends FieldPath<TFieldValues>,
    TCallback extends (
      value: FieldPathValue<TFieldValues, TFieldName>,
      payload: {
        name?: StartsWith<FieldPath<TFieldValues>, TFieldName>;
        type?: EventType;
        values?: FieldValues;
      }
    ) => void
  >(
    name: TFieldName,
    callback: TCallback
  ): void;
};

export const useCreateFormSubscribe = <TFieldValues extends FieldValues = FieldValues>(
  control: Control<TFieldValues>
) => {
  const useFormSubscribe: UseFormSubscribeHook<TFieldValues> = useCallback(
    <
      TFieldNames extends readonly FieldPath<TFieldValues>[],
      TFieldName extends FieldPath<TFieldValues>,
      TCallback extends (
        value:
          | FieldPathValue<TFieldValues, TFieldName>
          | FieldPathValues<TFieldValues, TFieldNames>,
        payload: {
          name?:
            | StartsWith<FieldPath<TFieldValues>, TFieldName>
            | StartsWith<FieldPath<TFieldValues>, TFieldNames[number]>;
          type?: EventType;
          values?: FieldValues;
        }
      ) => void
    >(
      name: TFieldName | readonly [...TFieldNames],
      callback: TCallback
    ) => {
      const fn = useEvent(callback);

      const shouldSend = useMemo<(eventName: string) => boolean>(
        () => {
          if (name instanceof Array)
            return (eventName) => name.some((n) => startsWith(eventName, n));
          return (eventName) => startsWith(eventName, name);
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        name instanceof Array ? name : [name]
      );

      useEffect(() => {
        // Watch has been renamed to values in https://github.com/react-hook-form/react-hook-form/commit/a8fb1a1ca7e9ab98545aaf1040a36f9c043cc69c
        // To support both versions, we need to use the old name for older versions
        const subject =
          // @ts-expect-error
          control._subjects.values ?? (control._subjects.watch as typeof control._subjects.values);

        return subject.subscribe({
          next: (payload) => {
            if (payload.name && shouldSend(payload.name)) {
              // @ts-expect-error
              fn(control._getWatch(name), payload);
            }
          },
        }).unsubscribe;

        // eslint-disable-next-line react-hooks/exhaustive-deps
      }, [control, fn, ...(name instanceof Array ? name : [name]), shouldSend]);
    },
    [control]
  );

  return useFormSubscribe;
};
