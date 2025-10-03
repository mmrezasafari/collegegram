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

export interface ICommentMutationBody {
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
  const query = commentId ? `?commentId=${commentId}` : ''
  const res = await api.get<IReplyCommentRes>(
    `/posts/${postId}/comment${query}`,
  )
  return res.data
}

export async function postComment(
  postId: string,
  content: string,
  parentId: string | null,
): Promise<IPostCommentRes> {
  const res = await api.post<IPostCommentRes>(`/posts/${postId}/comment`, {
    content,
    parentId,
  })
  return res.data
}

export function useGetComments(postId: string) {
  return useQuery<ICommentRes, AxiosError<IErrorRes>>({
    queryKey: ['comments', postId],
    queryFn: () => getComments(postId),
    enabled: !!postId,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    placeholderData: keepPreviousData,
  })
}

export function useGetRepliesComment(postId: string, parentId?: string) {
  return useQuery<IReplyCommentRes, AxiosError<IErrorRes>>({
    queryKey: ['replies', postId, parentId],
    queryFn: () => getRepliesComment(postId, parentId),
    enabled: !!postId && !!parentId,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  })
}

export function usePostComment(postId: string) {
  const queryClient = useQueryClient()

  return useMutation<ISuccessRes, AxiosError<IErrorRes>, ICommentMutationBody>({
    mutationKey: ['post', postId, 'comment'],
    mutationFn: ({ content, parentId }) =>
      postComment(postId, content, parentId),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments', postId] })
      notify.success('نظر شما با موفقیت ثبت شد', {
        position: 'top-right',
        duration: 10000,
      })
    },

    onError: (error) => {
      notify.error(error?.response?.data?.message ?? 'خطا در ثبت نظر', {
        position: 'top-right',
        duration: 10000,
      })
    },
  })
}
