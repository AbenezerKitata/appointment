import { Email, Name } from "core/valueObjects"

/**
 * ユーザー名
 */
export class NameFactory {
  static fromEmail(email: Email) {
    return new Name(email.value.substring(0, email.value.lastIndexOf("@")))
  }
}
