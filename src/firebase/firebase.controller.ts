import { Controller } from '@nestjs/common';
import { FirebaseService } from './firebase.service';

@Controller()
export class FirebaseController {
  constructor(private readonly firebaseService: FirebaseService) {}
}
