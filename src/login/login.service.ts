import { Injectable } from '@nestjs/common';
import { CreateLoginDto } from './dto/create-login.dto';
import { UpdateLoginDto } from './dto/update-login.dto';

@Injectable()
export class LoginService {
  async appleLogin(accessToken: string) {
    const { email, oauthId } = await this.resolveUserInfoFromApple(accessToken);

    const user = await this.getOrCreateUser(email, 'apple', oauthId);

    return this.onSuccess(user);
  }

  async resolveUserInfoFromApple(accessToken: string) {
    try {
      return await getAppleOAuthInfo(accessToken);
    } catch (error) {
      printError(e);

      throw WrongAuth();
    }
  }

  create(createLoginDto: CreateLoginDto) {
    return 'This action adds a new login';
  }

  findAll() {
    return `This action returns all login`;
  }

  findOne(id: number) {
    return `This action returns a #${id} login`;
  }

  update(id: number, updateLoginDto: UpdateLoginDto) {
    return `This action updates a #${id} login`;
  }

  remove(id: number) {
    return `This action removes a #${id} login`;
  }
}
