import { MODULE_METADATA } from '@nestjs/common/constants';
import { ConsultationsController } from './consultations.controller';
import { ConsultationsModule } from './consultations.module';
import { DebugController } from './debug.controller';
import { TestController } from './test.controller';

describe('ConsultationsModule', () => {
  it('registers only the product consultation controller in the production module graph', () => {
    const controllers = Reflect.getMetadata(MODULE_METADATA.CONTROLLERS, ConsultationsModule);

    expect(controllers).toEqual([ConsultationsController]);
    expect(controllers).not.toContain(DebugController);
    expect(controllers).not.toContain(TestController);
  });
});
