import { FileImplementationService } from 'src/services/implementation/file/file.service';
import {container} from 'tsyringe';

export const setupDI = () => {
  container.register('FileService', {
    useClass: FileImplementationService
  });
};