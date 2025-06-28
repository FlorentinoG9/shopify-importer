import { client } from '@workspace/api/client'
import { UploadFiles } from '@/components/file-upload'

export default async function Page() {
  const res = await client.hello.$get()

  const { message } = await res.json()

  console.info(message)

  return (
    <div className="flex h-full min-h-svh gap-4 p-4">
      <section className="flex h-full flex-1 basis-1/2 flex-col items-center justify-start gap-4">
        <UploadFiles />
      </section>

      <section className="flex h-full flex-1 basis-1/2 flex-col items-center justify-start gap-4">
        <h1 className="font-bold text-2xl">Import Preview</h1>

        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <h2 className="font-bold text-lg">File Name</h2>
          </div>
        </div>
      </section>
    </div>
  )
}
