import { useMutation } from '@apollo/client'
import { Button, FormElement, Input, Loading, Modal, Spacer, Text } from '@nextui-org/react'
import { ChangeEvent, useCallback, useMemo, useState } from 'react'
import type { DataInterface, SignInUserInterface, SignUserInterface } from 'shared'

import { SIGN_IN } from '~/queries/user'

import { LockIcon } from './icons/LockIcon'
import PersonIcon from './icons/PersonIcon'

export interface SignInModalProps {
  open: boolean
  onData: (data?: SignUserInterface | null) => void
  onClose: () => void
}

export default function SignInModal({ onClose, onData, open }: SignInModalProps) {
  const [state, setState] = useState<SignInUserInterface>({
    password: '',
    username: '',
  })
  const [signIn, { loading }] = useMutation<DataInterface>(SIGN_IN, {
    variables: {
      data: state,
    },
  })

  const isValid = useMemo(() => state.password !== '' && state.username !== '', [state])

  const handleClose = useCallback((callback: Function) => {
    setState({ username: '', password: '' })
    callback()
  }, [])

  const handleSubmit = useCallback(async () => {
    const { data, errors } = await signIn()
    if (!errors) handleClose(() => onData(data?.signIn))
  }, [handleClose, onData, signIn])

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

  return (
    <Modal closeButton blur open={open} onClose={() => handleClose(onClose)}>
      <Modal.Header>
        <Text h3>Sign In</Text>
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
          contentLeft={<PersonIcon />}
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
