import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../common/prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { QueryProductsDto } from './dto/query-products.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(ownerId: string, dto: CreateProductDto) {
    try {
      const product = await this.prisma.product.create({
        data: {
          name: dto.name,
          description: dto.description,
          price: dto.price,
          ownerId,
        },
      });

      return this.toProductResponse(product);
    } catch (error) {
      this.handlePrismaError(error, 'Failed to create product');
    }
  }

  async findAll(ownerId: string, query: QueryProductsDto) {
    const page = query.page ?? 1;
    const limit = query.limit ?? 8;
    const sortBy = query.sortBy ?? 'createdAt';
    const sortOrder = query.sortOrder ?? 'desc';

    const where: Prisma.ProductWhereInput = {
      ownerId,
    };

    if (query.search && query.search.trim().length > 0) {
      const term = query.search.trim();
      where.OR = [
        {
          name: {
            contains: term,
            mode: 'insensitive',
          },
        },
        {
          description: {
            contains: term,
            mode: 'insensitive',
          },
        },
      ];
    }

    if (typeof query.minPrice === 'number' || typeof query.maxPrice === 'number') {
      where.price = {};

      if (typeof query.minPrice === 'number') {
        where.price.gte = query.minPrice;
      }

      if (typeof query.maxPrice === 'number') {
        where.price.lte = query.maxPrice;
      }
    }

    try {
      const [totalItems, products] = await Promise.all([
        this.prisma.product.count({ where }),
        this.prisma.product.findMany({
          where,
          orderBy: { [sortBy]: sortOrder },
          skip: (page - 1) * limit,
          take: limit,
        }),
      ]);

      const totalPages = Math.max(1, Math.ceil(totalItems / limit));

      return {
        items: products.map((product) => this.toProductResponse(product)),
        meta: {
          page,
          limit,
          totalItems,
          totalPages,
          hasNext: page < totalPages,
          hasPrev: page > 1,
        },
      };
    } catch (error) {
      this.handlePrismaError(error, 'Failed to fetch products');
    }
  }

  async getSummary(ownerId: string) {
    try {
      const [totalUsers, totalProducts, totalRevenue] = await Promise.all([
        this.prisma.user.count(),
        this.prisma.product.count({ where: { ownerId } }),
        this.prisma.product.aggregate({
          where: { ownerId },
          _sum: {
            price: true,
          },
        }),
      ]);

      return {
        totalUsers,
        totalProducts,
        totalRevenue: totalRevenue._sum.price ?? 0,
      };
    } catch (error) {
      this.handlePrismaError(error, 'Failed to fetch summary');
    }
  }

  async findOne(id: string, ownerId: string) {
    let product;

    try {
      product = await this.prisma.product.findUnique({ where: { id } });
    } catch (error) {
      this.handlePrismaError(error, 'Failed to fetch product');
    }

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    if (product.ownerId !== ownerId) {
      throw new ForbiddenException('You can only access your own products');
    }

    return this.toProductResponse(product);
  }

  async update(id: string, ownerId: string, dto: UpdateProductDto) {
    let product;

    try {
      product = await this.prisma.product.findUnique({ where: { id } });
    } catch (error) {
      this.handlePrismaError(error, 'Failed to fetch product');
    }

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    if (product.ownerId !== ownerId) {
      throw new ForbiddenException('You can only update your own products');
    }

    try {
      const updatedProduct = await this.prisma.product.update({
        where: { id },
        data: {
          name: dto.name,
          description: dto.description,
          price: dto.price,
        },
      });

      return this.toProductResponse(updatedProduct);
    } catch (error) {
      this.handlePrismaError(error, 'Failed to update product');
    }
  }

  async remove(id: string, ownerId: string) {
    let product;

    try {
      product = await this.prisma.product.findUnique({ where: { id } });
    } catch (error) {
      this.handlePrismaError(error, 'Failed to fetch product');
    }

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    if (product.ownerId !== ownerId) {
      throw new ForbiddenException('You can only delete your own products');
    }

    try {
      const deletedProduct = await this.prisma.product.delete({ where: { id } });
      return this.toProductResponse(deletedProduct);
    } catch (error) {
      this.handlePrismaError(error, 'Failed to delete product');
    }
  }

  private toProductResponse(product: {
    id: string;
    name: string;
    description: string | null;
    price: Prisma.Decimal;
    createdAt: Date;
  }) {
    return {
      id: product.id,
      name: product.name,
      description: product.description,
      price: product.price,
      createdAt: product.createdAt,
    };
  }

  private handlePrismaError(error: unknown, fallbackMessage: string): never {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === 'P2023'
    ) {
      throw new BadRequestException('Invalid identifier format');
    }

    throw new InternalServerErrorException(fallbackMessage);
  }
}