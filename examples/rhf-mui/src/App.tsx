import { Add, ArrowDropDown, ArrowDropUp, Delete } from '@mui/icons-material';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Container,
  Divider,
  Stack,
  Typography,
} from '@mui/material';

import { FC, Fragment } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { TextFieldElement } from 'react-hook-form-mui';
import { useCreateFormSubscribe } from 'react-hook-form-subscribe';

export const App: FC = () => {
  const { control } = useForm({
    defaultValues: {
      user: {
        firstname: '',
        lastname: '',
      },
      tuple: [
        {
          firstname: '',
          lastname: '',
        },
        { firstname: '', lastname: '' },
      ],
      array: [
        {
          firstname: '',
          lastname: '',
        },
      ],
    },
  });

  const { fields, append, prepend, remove, swap, move, insert } = useFieldArray({
    control,
    name: 'array',
  });

  const useFormSubscribe = useCreateFormSubscribe(control);

  // subscribing to only the changes to user.firstname
  useFormSubscribe('user.firstname', (firstname) => console.log('user.firstname', firstname));

  // subscribing to both the changes to user.firstname and user.lastname
  useFormSubscribe(['user.firstname', 'user.lastname'], ([firstname, lastname], payload) =>
    console.log('Either user.firstname or user.lastname changed', firstname, lastname, payload)
  );

  // subscribing to all the changes of array
  useFormSubscribe('array', (array, payload) => {
    console.log(
      'Array changed, firstnames:',
      array.map((user) => user.firstname).join(','),
      payload
    );
  });

  // subscribing to the changes of the first firstname and the second lastname inside the tuple
  useFormSubscribe(['tuple.0.firstname', 'tuple.1.lastname'], ([firstname, lastname]) => {
    console.log('Either tuple.0.firstname or tuple.1.lastname have changed', firstname, lastname);
  });

  return (
    <Container>
      <Stack gap={2}>
        <Card>
          <CardHeader title="Default" subheader="" />
          <CardContent>
            <Stack gap={1}>
              <TextFieldElement
                fullWidth
                control={control}
                name="user.firstname"
                placeholder="Firstname"
              />
              <TextFieldElement
                fullWidth
                control={control}
                name="user.lastname"
                placeholder="Lastname"
              />
            </Stack>
          </CardContent>
        </Card>
        <Card>
          <CardHeader title="FieldArray" />
          <CardContent>
            {fields.map((field, index) => (
              <Fragment key={field.id}>
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-end',
                  }}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: 'row',
                      width: '100%',
                      gap: 1,
                    }}
                  >
                    <TextFieldElement
                      control={control}
                      fullWidth
                      placeholder="Firstname"
                      name={`array.${index}.firstname`}
                    />
                    <TextFieldElement
                      control={control}
                      fullWidth
                      placeholder="Lastname"
                      name={`array.${index}.lastname`}
                    />
                  </Box>
                  <Box mt={2}>
                    <Button
                      onClick={() => swap(index, index - 1)}
                      disabled={index === 0}
                      color="primary"
                      startIcon={<ArrowDropUp />}
                    >
                      Up
                    </Button>
                    <Button
                      onClick={() => swap(index, index + 1)}
                      disabled={fields.length - 1 === index}
                      color="primary"
                      startIcon={<ArrowDropDown />}
                    >
                      Down
                    </Button>
                    <Button onClick={() => remove(index)} color="error" startIcon={<Delete />}>
                      Delete
                    </Button>
                  </Box>
                </Box>

                <Divider orientation="horizontal" />
              </Fragment>
            ))}
            <Box>
              <Button
                onClick={() =>
                  append({
                    firstname: '',
                    lastname: '',
                  })
                }
                startIcon={<Add />}
                color="primary"
              >
                Add Item
              </Button>
            </Box>
          </CardContent>
        </Card>
        <Card>
          <CardHeader title="Tuple" />
          <CardContent>
            <Typography>First</Typography>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'row',
                width: '100%',
                gap: 1,
              }}
            >
              <TextFieldElement
                fullWidth
                control={control}
                name="tuple.0.firstname"
                placeholder="Firstname"
              />
              <TextFieldElement
                fullWidth
                control={control}
                name="tuple.0.lastname"
                placeholder="Lastname"
              />
            </Box>
            <Typography>Second</Typography>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'row',
                width: '100%',
                gap: 1,
              }}
            >
              <TextFieldElement
                fullWidth
                control={control}
                name="tuple.1.firstname"
                placeholder="Firstname"
              />
              <TextFieldElement
                fullWidth
                control={control}
                name="tuple.1.lastname"
                placeholder="Lastname"
              />
            </Box>
          </CardContent>
        </Card>
      </Stack>
    </Container>
  );
};
