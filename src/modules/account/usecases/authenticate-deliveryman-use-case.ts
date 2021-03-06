import { compare } from "bcrypt";
import { sign } from "jsonwebtoken";
import { prisma } from "../../../database/prisma-client";

export class AuthenticateDeliverymanUseCase {
  async execute({ username, password }: AuthenticateDeliverymanUseCase.Request) {
    const deliveryman = await prisma.deliveryman.findFirst({
      where: {
        username
      }
    });

    if (!deliveryman) {
      throw new Error("Username or password invalid");
    }

    const passwordMatch = await compare(password, deliveryman.password);

    if (!passwordMatch) {
      throw new Error("Username or password invalid");
    }

    const token = sign({ username }, process.env.DELIVERYMAN_SECRET!, {
      subject: deliveryman.id,
      expiresIn: "1d"
    });

    return token;
  }
}

export namespace AuthenticateDeliverymanUseCase {
  export interface Request {
    username: string;
    password: string;
  }
}
