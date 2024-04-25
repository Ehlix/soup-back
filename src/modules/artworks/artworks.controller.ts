import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  Query,
  Req,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ArtworksService } from './artworks.service';
import { AccessTokenGuard } from 'src/guards/accessToken.guard';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { Request } from 'express';
import { CreateArtworksDto } from './dto/create-artworks-dto';
import { GetUserArtworksDto } from './dto/get-user-artworks-dto';
import { GetAllArtworksDto } from './dto/get-all-artworks-dto';
import { ArtworksResponse } from './response/artworksResponse';
import { updateArtworkDto } from './dto/update-artwork-dto';

type InterceptorData = {
  thumbnail: Express.Multer.File[];
  files: Express.Multer.File[];
};

const uploadImagesInterceptor = [
  {
    name: 'thumbnail',
    maxCount: 1,
  },
  {
    name: 'files',
    maxCount: 5,
  },
];

@Controller('artworks')
export class ArtworksController {
  constructor(private readonly artworksService: ArtworksService) {}

  @Get('all')
  getAllArtworks(@Body() dto: GetAllArtworksDto): Promise<ArtworksResponse[]> {
    return this.artworksService.getAllArtworks(dto);
  }

  @Get('user-artworks')
  getUserArtworks(
    @Body() dto: GetUserArtworksDto,
  ): Promise<ArtworksResponse[]> {
    return this.artworksService.getUserArtworks(dto.userId);
  }

  @UseGuards(AccessTokenGuard)
  @Post('upload-images')
  @UseInterceptors(FileFieldsInterceptor(uploadImagesInterceptor))
  uploadImages(
    @Req() req: Request,
    @UploadedFiles()
    data: InterceptorData,
  ): Promise<{ thumbnail: string; files: string[] }> {
    return this.artworksService.uploadImages(req, data);
  }

  @UseGuards(AccessTokenGuard)
  @Post('create')
  createArtwork(
    @Req() req: Request,
    @Body() dto: CreateArtworksDto,
  ): Promise<ArtworksResponse> {
    return this.artworksService.createArtwork(req, dto);
  }

  @UseGuards(AccessTokenGuard)
  @Patch('update')
  updateArtwork(
    @Req() req: Request,
    @Body() dto: updateArtworkDto,
    @Query('id') id: string,
  ): Promise<ArtworksResponse> {
    return this.artworksService.updateArtwork(req, dto, id);
  }

  @UseGuards(AccessTokenGuard)
  @Delete()
  deleteArtwork(
    @Req() req: Request,
    @Query('id') id: string,
  ): Promise<boolean> {
    return this.artworksService.deleteArtwork(req, id);
  }
}
