import {
  Body,
  Controller,
  Delete,
  Get,
  ParseUUIDPipe,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { QueryProductsDto } from './dto/query-products.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { GetUser } from '../common/decorators/get-user.decorator';

@Controller('products')
@UseGuards(JwtAuthGuard)
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  create(
    @GetUser('sub') ownerId: string,
    @Body() createProductDto: CreateProductDto,
  ) {
    return this.productsService.create(ownerId, createProductDto);
  }

  @Get()
  findAll(
    @GetUser('sub') ownerId: string,
    @Query() query: QueryProductsDto,
  ) {
    return this.productsService.findAll(ownerId, query);
  }

  @Get('summary')
  getSummary(@GetUser('sub') ownerId: string) {
    return this.productsService.getSummary(ownerId);
  }

  @Get(':id')
  findOne(
    @Param('id', new ParseUUIDPipe()) id: string,
    @GetUser('sub') ownerId: string,
  ) {
    return this.productsService.findOne(id, ownerId);
  }

  @Patch(':id')
  update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @GetUser('sub') ownerId: string,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    return this.productsService.update(id, ownerId, updateProductDto);
  }

  @Delete(':id')
  remove(
    @Param('id', new ParseUUIDPipe()) id: string,
    @GetUser('sub') ownerId: string,
  ) {
    return this.productsService.remove(id, ownerId);
  }
}