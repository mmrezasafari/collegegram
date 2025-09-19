import { notify } from '@/features/common/components/ui/sonner'
import api from '@/lib/axios'
import type {
  ICommentRes,
  IPostCommentRes,
  IReplyCommentRes,
} from '@/types/comment'
import type { IErrorRes, ISuccessRes } from '@/types/error'
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query'
import type { AxiosError } from 'axios'

interface ICommentMutationBody {
  content: string
  parentId: string | null
}

export async function getComments(postId: string): Promise<ICommentRes> {
  const res = await api.get<ICommentRes>(`/posts/${postId}/comment`)

  return res.data
}

export async function getRepliesComment(
  postId: string,
  commentId?: string,
): Promise<IReplyCommentRes> {
  const res = await api.get<IReplyCommentRes>(
    `/posts/${postId}/comment${commentId && `?commentId=${commentId}`}`,
  )

  return res.data
}

export async function postComment(
  postId: string,
  content: string,
  parentId: string | null,
): Promise<IPostCommentRes> {
  const res = await api.post<IPostCommentRes>(`posts/${postId}/comment`, {
    content: content,
    parentId: parentId,
  })

  return res.data
}

export function useGetComments(postId: string) {
  return useQuery<ICommentRes, AxiosError<IErrorRes>>({
    queryKey: ['comments', postId],
    queryFn: () => getComments(postId),
    enabled: !!postId,
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
    placeholderData: keepPreviousData,
  })
}

export function useGetRepliesComment(postId: string, commentId?: string) {
  return useQuery<IReplyCommentRes, AxiosError<IErrorRes>>({
    queryKey: ['replies', postId, commentId],
    queryFn: () => getRepliesComment(postId, commentId),
    enabled: !!postId && !!commentId,
    staleTime: 0,
    refetchOnWindowFocus: false,
    placeholderData: keepPreviousData,
  })
}

export function usePostComment(postId: string) {
  const queryClient = useQueryClient()
  return useMutation<ISuccessRes, AxiosError<IErrorRes>, ICommentMutationBody>({
    mutationKey: ['post', postId, 'comment'],
    mutationFn: ({ content, parentId }) =>
      postComment(postId, content, parentId),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ['comments', postId] }),
    onError: (error) => {
      notify.error(error?.response?.data?.message || 'خطا در ثبت نظر', {
        position: 'top-right',
        duration: 10000,
      })
    },
  })
}
