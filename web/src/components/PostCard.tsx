import { Card, Grid, Link as NextUILink, Text } from '@nextui-org/react'
import { ReactNode, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { PostInterface } from 'shared'

import { dateFormat } from '~/lib/utils'

import CommentMultipleIcon from './icons/CommentMultipleIcon'

export interface PostCardProps {
  post: PostInterface
}

export default function PostCard({ post }: PostCardProps) {
  const renderParagraphs = useCallback<(body: string) => ReactNode>(
    (body: string) =>
      body.split('\n').map((text, id) => (
        <Text key={id} css={{ lineHeight: '$md' }}>
          {text}
        </Text>
      )),
    [],
  )

  return (
    <Grid key={post.id} xs={12} sm={6} lg={4}>
      <Link to={`/${post.id}`}>
        <Card isHoverable isPressable>
          <Card.Header>
            <Grid.Container>
              <Grid xs={12}>
                <Text
                  h3
                  css={{
                    height: 'calc(36px * 2)',
                    overflow: 'hidden',
                  }}
                >
                  {post.title}
                </Text>
              </Grid>
              <Grid xs={12}>
                <Grid.Container gap={1} alignItems="center">
                  <Grid>
                    <NextUILink href={`?user=${post.user.username}`}>
                      {post.user.username}
                    </NextUILink>
                  </Grid>
                  <Grid>
                    <Text size="small" as="time">
                      {dateFormat(post.updatedAt)}
                    </Text>
                  </Grid>
                  <Grid css={{ display: 'flex', alignItems: 'center' }}>
                    <Text size="$sm" span css={{ pr: 3 }}>
                      {post.comments.length}
                    </Text>
                    <Text span color="warning" css={{ lineHeight: 0 }}>
                      <CommentMultipleIcon />
                    </Text>
                  </Grid>
                </Grid.Container>
              </Grid>
            </Grid.Container>
          </Card.Header>
          <Card.Body>
            <Grid
              css={{
                maxHeight: 'calc(1.5rem * 4)',
                overflow: 'hidden',
                padding: '$0',
              }}
            >
              {renderParagraphs(post.body)}
            </Grid>
          </Card.Body>
        </Card>
      </Link>
    </Grid>
  )
}
