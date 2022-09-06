import { useQuery } from '@apollo/client'
import { Container, Dropdown, Grid, Pagination } from '@nextui-org/react'
import { FC, useMemo, useState } from 'react'
import type {
  DataInterface,
  OperationVariablesInterface,
  PaginationInputInterface,
} from 'shared'

import PostCard from '~/components/PostCard'
import { COUNT_POSTS, GET_POSTS } from '~/queries/post'

export const HomePage: FC = () => {
  const [offset, setOffset] = useState(1)
  const [limit, setLimit] = useState(new Set(['6']))

  const pagination = useMemo<PaginationInputInterface>(
    () => ({
      offset: offset - 1,
      limit: +Array.from(limit)[0],
    }),
    [offset, limit],
  )

  const { data: countData } = useQuery<DataInterface>(COUNT_POSTS)
  const { data } = useQuery<DataInterface, OperationVariablesInterface>(
    GET_POSTS,
    {
      variables: { pagination },
    },
  )

  const posts = useMemo(() => data?.posts, [data?.posts])
  const countPosts = useMemo(
    () => countData?.countPosts,
    [countData?.countPosts],
  )

  const limitValue = useMemo(
    () => Array.from(limit).join(', ').replaceAll('_', ' '),
    [limit],
  )

  const renderPosts = useMemo(
    () => posts?.map(post => <PostCard key={post.id} post={post} />),
    [posts],
  )

  return (
    <Container responsive lg={true}>
      <Grid.Container gap={2}>
        <Grid xs={12} justify="flex-end" alignItems="center">
          <Dropdown>
            <Dropdown.Button size="sm" flat>
              {limitValue}
            </Dropdown.Button>
            <Dropdown.Menu
              selectionMode="single"
              selectedKeys={limit}
              onSelectionChange={key => setLimit(key as Set<string>)}
              disallowEmptySelection
            >
              {['6', '12', '24'].map(v => (
                <Dropdown.Item key={v}>{v}</Dropdown.Item>
              ))}
            </Dropdown.Menu>
          </Dropdown>
        </Grid>
        {renderPosts}
        <Grid xs={12} justify="center">
          <Pagination
            total={Math.round(
              countPosts && limitValue ? countPosts / +limitValue : 1,
            )}
            initialPage={offset}
            onChange={setOffset}
          />
        </Grid>
      </Grid.Container>
    </Container>
  )
}
