import type { Post } from '../../api/types.ts'

/** A post as shown in the list; `isLocal` marks posts the API did not persist. */
export type PostListItem = Post & { isLocal?: boolean }
