import { FC } from 'react';
import { useForm } from 'react-hook-form';
import { useCreateFormSubscribe } from 'react-hook-form-subscribe';

export const App: FC = () => {
  const { control, register } = useForm({
    defaultValues: {
      firstname: '',
      lastname: '',
    },
  });

  const useFormSubscribe = useCreateFormSubscribe(control);

  // subscribing to only the changes to firstname
  useFormSubscribe('firstname', (firstname) => console.log('firstname changed:', firstname));

  // subscribing to both the changes to firstname and lastname
  useFormSubscribe(['firstname', 'lastname'], ([firstname, lastname]) =>
    console.log('Either firstname or lastname changed:', firstname, lastname)
  );

  return (
    <form>
      <input placeholder="firstname" {...register('firstname')} />
      <input placeholder="lastname" {...register('lastname')} />
    </form>
  );
};
