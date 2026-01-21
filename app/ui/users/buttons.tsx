import {  TrashIcon } from '@heroicons/react/24/outline';
import { deleteUser } from '@/app/lib/actions';

// ユーザー削除ボタン
export function DeleteUser({ id }: { id: string }) {
  const deleteUserWithId = deleteUser.bind(null, id);

  return (
    <form action={deleteUserWithId}>
      {/* フォームに削除したいユーザーのidを隠しフィールドとして含めます */}
      <input type="hidden" name="id" value={id} />
      <button type="submit" className="rounded-md border p-2 hover:bg-gray-100">
        <span className="sr-only">Delete</span>
        <TrashIcon className="w-5" />
      </button>
    </form>
  );
}