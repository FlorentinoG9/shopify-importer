import { client } from '@workspace/api/client'
import { UploadFiles } from '@/components/file-upload'

export default async function Page() {
  const res = await client.hello.$get()

  const { message } = await res.json()

  console.info(message)

  return (
    <div className="flex min-h-svh items-center justify-center">
      <UploadFiles />
    </div>
  )
}
