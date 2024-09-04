import { Controller } from '@nestjs/common';
import { FirebaseService } from './firebase.service';

@Controller()
export class FirebaseController {
  constructor(private readonly firebaseService: FirebaseService) {}

  // @Get('test')
  // @SkipJwtAuthGuard
  // @ApiQuery({ name: 'token', required: true })
  // @ApiQuery({ name: 'title', required: true })
  // @ApiQuery({ name: 'message', required: true })
  // async test(@Request() req) {
  //   const result = await this.firebaseService.fcm(
  //     req.query.token,
  //     req.query.title,
  //     req.query.message,
  //   );
  //   return result;
  // }
}
