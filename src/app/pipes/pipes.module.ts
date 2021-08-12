import { NgModule } from '@angular/core';
import { AmFromUnixPipe } from './am-from-unix.pipe';
import { RegionPipe } from './region.pipe';

@NgModule({
  declarations: [AmFromUnixPipe, RegionPipe],
  imports: [],
  exports: [AmFromUnixPipe, RegionPipe]
})
export class PipesModule {}
