import { ApolloServerErrorCode } from "@apollo/server/errors"
import { GraphQLError } from "graphql"
import { container } from "tsyringe"
import db from "db"
import {
  LabelNode,
  MutationResolvers,
  PostNode,
} from "interface/__generated__/node"
import { CreatePostCommand } from "service"

export const createPostResolver: MutationResolvers["createPost"] = async (
  _,
  args,
  ctx,
) => {
  if (ctx.currentUser === null) {
    throw new GraphQLError("ERROR", {
      extensions: { code: ApolloServerErrorCode.INTERNAL_SERVER_ERROR },
    })
  }

  const command = container.resolve(CreatePostCommand)

  const output = await command.execute({
    userId: ctx.currentUser.uid,
    postFileId: args.input.fileId,
  })

  if (output instanceof Error) {
    throw new GraphQLError("ERROR", {
      extensions: { code: ApolloServerErrorCode.INTERNAL_SERVER_ERROR },
    })
  }

  const post = await db.post.findUnique({
    where: { id: output.postId },
    include: {
      user: true,
      labels: { include: { _count: { select: { posts: true } } } },
    },
  })

  if (post === null) {
    throw new GraphQLError("ERROR", {
      extensions: { code: ApolloServerErrorCode.INTERNAL_SERVER_ERROR },
    })
  }

  const labels: LabelNode[] = post.labels.map((label) => {
    return {
      id: label.id,
      name: label.name,
      count: label._count.posts,
      posts: [],
    }
  })

  const node: PostNode = {
    id: post.id,
    createdAt: Math.floor(post.createdAt.getTime() / 1000),
    fileId: post.fileId,
    title: post.title,
    model: post.model,
    prompt: post.prompt,
    likeCount: 0,
    annotationAdult: post.annotationAdult,
    annotationMedical: post.annotationMedical,
    annotationViolence: post.annotationViolence,
    annotationRacy: post.annotationRacy,
    annotationSpoof: post.annotationSpoof,
    colors: post.colors,
    webColors: post.webColors,
    labels: labels,
    user: {
      id: post.user.id,
      name: post.user.name,
      login: null,
      createdAt: Math.floor(post.user.createdAt.getTime() / 1000),
      avatarImageURL: post.user.avatarImageURL,
      avatarImageId: post.user.avatarFileId,
      headerImageId: null,
      biography: "",
      posts: [],
    },
  }

  return node
}
