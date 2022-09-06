import { useQuery } from '@apollo/client'
import { Card, Container, Grid, Link as NUILink, Text } from '@nextui-org/react'
import { FC, ReactNode, useCallback, useMemo } from 'react'
import { Link, useParams } from 'react-router-dom'
import { DataInterface } from 'shared'

import { dateFormat } from '~/lib/utils'
import { GET_POST } from '~/queries/post'

export const PostPage: FC = () => {
  const { id } = useParams()

  const { data } = useQuery<DataInterface>(GET_POST, {
    variables: {
      data: { id },
    },
  })

  const post = useMemo(() => data?.post, [data?.post])

  const renderParagraphs = useCallback<(body: string) => ReactNode>(
    (body: string) =>
      body.split('\n').map((text, id) => <Text key={id}>{text}</Text>),
    [],
  )

  const renderComments = useMemo(
    () =>
      post?.comments.map(comment => (
        <Grid key={comment.id}>
          <Card isHoverable variant="flat">
            <Card.Header>
              <Grid.Container direction="column">
                <Grid>
                  <Text b>{comment.user.username}</Text>
                </Grid>
                <Grid>
                  <Text size="small" as="time">
                    {dateFormat(comment.updatedAt)}
                  </Text>
                </Grid>
              </Grid.Container>
            </Card.Header>
            <Card.Divider />
            <Card.Body>{renderParagraphs(comment.body)}</Card.Body>
          </Card>
        </Grid>
      )),
    [post?.comments, renderParagraphs],
  )

  if (!post) return null

  return (
    <Container responsive lg={true}>
      <Grid.Container gap={2}>
        <Grid.Container gap={2} xs={12}>
          <Grid xs={12}>
            <Text h1>{post.title}</Text>
          </Grid>
          <Grid>
            <Link to={`/?user=${post.user.username}`}>
              <NUILink>{post.user.username}</NUILink>
            </Link>
          </Grid>
          <Grid>
            <Text size="small" as="time">
              {dateFormat(post.updatedAt)}
            </Text>
          </Grid>
        </Grid.Container>
        <Grid xs={12} direction="column">
          {renderParagraphs(post.body)}
        </Grid>
        <Grid.Container xs={12} direction="column" gap={2}>
          <Text h3>Comments</Text>
          {renderComments}
        </Grid.Container>
      </Grid.Container>
    </Container>
  )
}
