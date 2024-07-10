import { Entity } from '@/core/entities/Entity'
import { Optional } from '@/core/types/optional'

export type ProductProps = {
  name: string
  description: string
  imageUrl: string
  userId: string
  createdAt: Date
  updatedAt?: Date | null
}

export class Product extends Entity<ProductProps> {
  get name() {
    return this.props.name
  }

  set name(name: string) {
    this.props.name = name
    this.touch()
  }

  get description() {
    return this.props.description
  }

  set description(description: string) {
    this.props.description = description
    this.touch()
  }

  get imageUrl() {
    return this.props.imageUrl
  }

  set imageUrl(imageUrl: string) {
    this.props.imageUrl = imageUrl
    this.touch()
  }

  get userId() {
    return this.props.userId
  }

  get createdAt() {
    return this.props.createdAt
  }

  get updatedAt() {
    return this.props.updatedAt
  }

  private touch() {
    this.props.updatedAt = new Date()
  }

  static create(props: Optional<ProductProps, 'createdAt'>, id?: string) {
    const product = new Product(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    )

    return product
  }
}
