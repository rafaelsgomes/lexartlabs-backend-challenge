import { User, UserProps } from "@/domain/entities/User";
import {faker} from '@faker-js/faker'

export function makeUser(override: Partial<UserProps> = {}, id?: string){
  const user = User.create({
    email: faker.internet.email(),
    name: faker.person.fullName(),
    password: faker.internet.password({
      length:20
    }),
    ...override
  }, id)

  return user
}