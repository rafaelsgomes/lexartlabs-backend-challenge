import { Entity } from "@/core/entities/Entity";
import { Optional } from "@/core/types/optional";

export type UserProps = {
  name: string
  email: string
  password: string
  createdAt: Date
  updatedAt?: Date | null
}

export class User extends Entity<UserProps>{
  get name(){
    return this.props.name
  }

  set name(name: string){
    this.props.name = name
    this.touch()
  }

  get email(){
    return this.props.email
  }

  set email(email: string){
    this.props.email = email
    this.touch()
  }

  get password(){
    return this.props.password
  }

  set password(password: string){
    this.props.password = password
    this.touch()
  }

  private touch(){
    this.props.updatedAt = new Date()
  }

  static create(props: Optional<UserProps, 'createdAt'>, id?: string){
    const user = new User({
      ...props,
      createdAt: props.createdAt ?? new Date()
    }, id)

    return user
  }
}