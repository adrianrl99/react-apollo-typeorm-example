import { useMutation } from '@apollo/client'
import { Button, FormElement, Input, Loading, Modal, Spacer, Text } from '@nextui-org/react'
import { ChangeEvent, useCallback, useEffect, useMemo, useState } from 'react'
import type { DataInterface, SignUpUserInterface, SignUserInterface } from 'shared'

import { SIGN_UP } from '~/queries/user'

import { LockIcon } from './icons/LockIcon'
import MailIcon from './icons/MailIcon'
import PersonIcon from './icons/PersonIcon'

export interface SignUpModalProps {
  open: boolean
  onData: (data?: SignUserInterface | null) => void
  onClose: () => void
}

export default function SignUpModal({ onClose, onData, open }: SignUpModalProps) {
  const [errors, setErrors] = useState<Record<string, string[]>>({
    password: [],
    username: [],
    email: [],
  })
  const [state, setState] = useState<SignUpUserInterface>({
    password: '',
    username: '',
    email: '',
  })

  const [signUp, { error, loading }] = useMutation<DataInterface>(SIGN_UP, {
    variables: {
      data: state,
    },
  })

  const isValid = useMemo(() => state.password !== '' && state.username !== '' && state.email, [state])

  const handleClose = useCallback((callback: Function) => {
    setState({ username: '', password: '', email: '' })
    setErrors({
      password: [],
      username: [],
      email: [],
    })
    callback()
  }, [])

  const handleSubmit = useCallback(async () => {
    const { data, errors } = await signUp()
    if (!errors) handleClose(() => onData(data?.signUp))
  }, [handleClose, onData, signUp])

  const handleChange = useCallback(
    (event: ChangeEvent<FormElement>) => {
      setState({
        ...state,
        [event.target.name]: event.target.value,
      })
    },
    [state],
  )

  const renderLoading = useMemo(
    () => (loading ? <Loading type="points" color="currentColor" size="sm" /> : 'Sign In'),
    [loading],
  )

  useEffect(() => {
    if (error?.message === 'Invalid fields' && error.graphQLErrors.length) {
      setErrors(
        Object.fromEntries(
          Object.entries(error.graphQLErrors[0].extensions.errorData).map(([k, v]) => [k, Object.values(v as object)]),
        ),
      )
    }
  }, [error])

  return (
    <Modal closeButton blur open={open} onClose={() => handleClose(onClose)}>
      <Modal.Header>
        <Text h3>Sign Up</Text>
      </Modal.Header>
      <Modal.Body>
        <Spacer y={0.3} />
        <Input
          clearable
          fullWidth
          color="secondary"
          bordered
          name="username"
          size="lg"
          onChange={handleChange}
          placeholder="username"
          helperColor={errors.username?.length ? 'error' : 'default'}
          helperText={errors.username?.join('\n')}
          contentLeft={<PersonIcon />}
        />
        <Spacer y={0.1} />
        <Input
          clearable
          fullWidth
          color="secondary"
          bordered
          name="email"
          size="lg"
          onChange={handleChange}
          placeholder="username@site.com"
          helperColor={errors.email?.length ? 'error' : 'default'}
          helperText={errors.email?.join('\n')}
          contentLeft={<MailIcon />}
        />
        <Spacer y={0.1} />
        <Input.Password
          clearable
          fullWidth
          name="password"
          color="secondary"
          bordered
          onChange={handleChange}
          size="lg"
          placeholder="strong password"
          helperColor={errors.password?.length ? 'error' : 'default'}
          helperText={errors.password?.join('\n')}
          contentLeft={<LockIcon />}
        />
        <Spacer y={0.3} />
      </Modal.Body>
      <Modal.Footer>
        <Button auto flat color="error" onClick={() => handleClose(onClose)} type="submit">
          Close
        </Button>
        <Button disabled={loading || !isValid} auto onClick={handleSubmit}>
          {renderLoading}
        </Button>
      </Modal.Footer>
    </Modal>
  )
}
