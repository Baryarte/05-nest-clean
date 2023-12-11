import {
  UploadParams,
  Uploader,
} from '@/domain/forum/application/storage/uploader'

interface Upload {
  fileName: string
  url: string
}

export class FakeUploader implements Uploader {
  public uploads: Upload[] = []

  async upload({ fileName }: UploadParams): Promise<{ url: string }> {
    this.uploads.push({
      fileName,
      url: `http://fake-url.com/${fileName}`,
    })

    return { url: `http://fake-url.com/${fileName}` }
  }
}
