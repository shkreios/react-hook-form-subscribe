# react-hook-form-subscribe

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


## License
`react-hook-form-subscribe` is released under the MIT License. See [`LICENSE`](./LICENSE) for details.