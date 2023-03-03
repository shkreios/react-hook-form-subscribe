Introducing react-hook-form-subscribe! 🔥</br>
Subscribe to React Hook Form field changes without re-renders 🔄 and enjoy an easy-to-use, readable API 🙌

```tsx
import { FC } from 'react';
import { useForm } from 'react-hook-form';
import { useCreateFormSubscribe } from 'react-hook-form-subscribe';

const App: FC = () => {
  const { control, register } = useForm({
    defaultValues: {
      firstname: '',
      lastname: '',
    },
  });

  const useFormSubscribe = useCreateFormSubscribe(control);

  useFormSubscribe('firstname', (firstname) => console.log(firstname));
  useFormSubscribe(['firstname', 'lastname'], ([firstname, lastname]) =>
    console.log(firstname, lastname)
  );

  return (
    <form>
      <input {...register('firstname')} />
      <input {...register('lastname')} />
    </form>
  );
};
```

## Examples

- Open Basic example in [CodeSandbox](https://codesandbox.io/s/github/shkreios/react-hook-form-subscribe/tree/main/examples/basic?file=/src/App.tsx) or [StackBlitz](https://stackblitz.com/github/shkreios/react-hook-form-subscribe/tree/main/examples/basic?file=src%2FApp.tsx)
- Open RHF-Mui example in [CodeSandbox](https://codesandbox.io/s/github/shkreios/react-hook-form-subscribe/tree/main/examples/rhf-mui?file=/src/App.tsx) or [StackBlitz](https://stackblitz.com/github/shkreios/react-hook-form-subscribe/tree/main/examples/rhf-mui?file=src%2FApp.tsx)

## Installation

```bash
npm install react-hook-form-subscribe --save
```

```bash
yarn add react-hook-form-subscribe
```

```bash
pnpm add react-hook-form-subscribe
```

## Usage

`react-hook-form-subscribe` exposes a single hook, `useCreateFormSubscribe`, that allows you to subscribe to changes on any controlled form field.

### `useCreateFormSubscribe`
`useCreateFormSubscribe` takes a single argument, the `control` object from `react-hook-form`. It returns a function that you can use to subscribe to changes on the form fields.

Arguments
- `control` (`Object`): The `control` object from `react-hook-form`.
Return value
- `useFormSubscribe` (`Function`): A function that you can use to subscribe to changes on the form fields.
```tsx
import { useCreateFormSubscribe } from 'react-hook-form-subscribe';
...
const useFormSubscribe = useCreateFormSubscribe(control);
```

### `useFormSubscribe`
`useFormSubscribe` is a the returned function from `useCreateFormSubscribe` that you can use to subscribe to changes on the form fields. It takes two arguments: the name of the field you want to subscribe to, and a callback function that will be called when the field changes.

Arguments
- `name` (`String` | `Array`): The name of the field you want to subscribe to. You can pass a single field name as a string, or an array of field names.
- `callback` (`Function`): A callback function that will be called when the field changes. The callback function will be passed the new value of the field.

```tsx
useFormSubscribe('firstname', (firstname) => console.log(firstname));
useFormSubscribe(['firstname', 'lastname'], ([firstname, lastname]) =>
  console.log(firstname, lastname)
);
```

In the example above, we subscribe to changes on the `firstname` field and log the new value to the console. We also subscribe to changes on the `firstname` and `lastname` fields and log their new values to the console.


# Experimental API

## `useCreateTrackedFormSubscribe`

**Caution the `useCreateTrackedFormSubscribe` is still experimental. Use it at your own risk.**

`useCreateTrackedFormSubscribe` is an experimental API that allows you to subscribe to changes without specifying the field names and instead it tracks accessed fields automatically via a es proxy.

By the nature of this different method of tracking fields, the callback will be called for first name if any field of the form changes, which establishes the baseline for the tracked fields.

To mitigate the quirks and overhead of proxy objects only this first call is tracked via the proxy object and the subsequent calls will not influence which fields are tracked.

This means that if the fields you access in the callback very from call to call, they are not properly tracked.

### Bad example

Demonstrated by this example where the callback accesses different fields based on a random number. The first call will determine which field is tracked.

```tsx
import { unstable_useCreateTrackedFormSubscribe as useCreateTrackedFormSubscribe } from 'react-hook-form-subscribe';
...
const useTrackedFormSubscribe = useCreateTrackedFormSubscribe(control);
...
useTrackedFormSubscribe(({firstname, lastname}) =>
  if(Math.random() > 0.5) {
    console.log(firstname)
  } else {
    console.log(firstname)
  }
);
```
### `useCreateTrackedFormSubscribe`
`useCreateTrackedFormSubscribe` takes a single argument, the `control` object from `react-hook-form`. It returns a function that you can use to subscribe to changes on the form fields.

Arguments
- `control` (`Object`): The `control` object from `react-hook-form`.
Return value
- `useTrackedFormSubscribe` (`Function`): A function that you can use to subscribe to changes on the form fields.
```tsx
import { unstable_useCreateTrackedFormSubscribe as useCreateTrackedFormSubscribe } from 'react-hook-form-subscribe';
...
const useTrackedFormSubscribe = useCreateTrackedFormSubscribe(control);
```

### `useTrackedFormSubscribe`
`useTrackedFormSubscribe` is a the returned function from `useTrackedFormSubscribe` that you can use to subscribe to changes on the form fields. It only takes one argument, a callback function that will be called when a tracked field changes.

Arguments
- `callback` (`Function`): A callback function that will be called when the field changes. The callback function will be passed the new value of the field.

```tsx
useTrackedFormSubscribe(({firstname}) => console.log(firstname));
useTrackedFormSubscribe(({firstname, lastname}) =>
  console.log(firstname, lastname)
);
```

## License
`react-hook-form-subscribe` is released under the MIT License. See [`LICENSE`](./LICENSE) for details.