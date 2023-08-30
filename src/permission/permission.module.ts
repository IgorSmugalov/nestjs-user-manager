import { DynamicModule, Module } from '@nestjs/common';
import { PERMISSIONS_FEATURE_OPTIONS } from './permission.const';
import { PermissionService } from './permission.service';
import { AbilityFactory } from './permissions.factory';
import { OptionsForFeature } from './permission.interface';

@Module({
  providers: [
    {
      provide: PERMISSIONS_FEATURE_OPTIONS,
      useValue: {},
    },
    PermissionService,
    AbilityFactory,
  ],
  exports: [PermissionService, AbilityFactory],
})
export class CaslModule {
  static forFeature(options: OptionsForFeature): DynamicModule {
    return {
      module: CaslModule,
      providers: [
        PermissionService,
        AbilityFactory,
        {
          provide: PERMISSIONS_FEATURE_OPTIONS,
          useValue: options,
        },
      ],
    };
  }
}
