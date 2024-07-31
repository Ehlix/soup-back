import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ArtworkLikesService } from './artwork-likes.service';
import { AccessTokenGuard } from 'src/guards/accessToken.guard';
import { Request } from 'express';
import { GetArtworksLikeDto } from './dto/get-artworks-like-dto';

@Controller('artwork-likes')
export class ArtworkLikesController {
  constructor(private readonly artworkLikesService: ArtworkLikesService) {}

  @Get('artwork')
  getArtworkLikes(@Query('artworkId') artworkId?: string) {
    return this.artworkLikesService.getArtworkLikes(artworkId);
  }

  @Post('user')
  getUserArtworkLikes(@Body() dto: GetArtworksLikeDto) {
    return this.artworkLikesService.getUserArtworkLikes(dto);
  }

  @Get('count')
  getArtworkLikesCount(@Query('artworkId') artworkId?: string) {
    return this.artworkLikesService.getArtworkLikesCount(artworkId);
  }

  @Get('count/user')
  getUserArtworkLikesCount(@Query('userId') userId?: string) {
    return this.artworkLikesService.getUserArtworkLikesCount(userId);
  }

  @Get('check')
  checkArtworkLike(
    @Query('artworkId') artworkId?: string,
    @Query('userId') userId?: string,
  ) {
    return this.artworkLikesService.checkArtworkLike(artworkId, userId);
  }

  @UseGuards(AccessTokenGuard)
  @Post('like')
  likeArtwork(@Req() req: Request, @Query('artworkId') artworkId?: string) {
    return this.artworkLikesService.likeArtwork(artworkId, req.user['id']);
  }

  @UseGuards(AccessTokenGuard)
  @Post('dislike')
  dislikeArtwork(@Req() req: Request, @Query('artworkId') artworkId?: string) {
    return this.artworkLikesService.dislikeArtwork(artworkId, req.user['id']);
  }
}
