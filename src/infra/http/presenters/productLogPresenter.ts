import { ProductLog } from '@/domain/application/useCases/product/getLogOfDeletedProducts'

export class ProductLogPresenter {
  static toHttp(productLog: ProductLog) {
    return {
      id: productLog.id,
      name: productLog.name,
      description: productLog.description,
      image_url: productLog.imageUrl,
      user_id: productLog.userId,
      created_at: productLog.createdAt,
      updated_at: productLog.updatedAt,
      deleted_at: productLog.deletedAt,
    }
  }
}
