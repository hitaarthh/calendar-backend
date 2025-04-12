import { IsString, IsDate, IsOptional, IsArray, IsEnum, IsNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class AttachmentDto {
    @ApiProperty({ enum: ['image', 'video'] })
    @IsEnum(['image', 'video'])
    type: 'image' | 'video';

    @ApiProperty()
    @IsString()
    url: string;

    @ApiProperty()
    @IsString()
    name: string;
}

export class CreateEventDto {
    @ApiProperty({ description: 'Event title' })
    @IsString()
    @IsNotEmpty()
    title: string;

    @ApiProperty({ description: 'Event description' })
    @IsString()
    description: string;

    @ApiProperty({ description: 'Event start date and time' })
    @Type(() => Date)
    @IsDate()
    startDate: Date;

    @ApiProperty({ description: 'Event end date and time', required: false })
    @IsOptional()
    @Type(() => Date)
    @IsDate()
    endDate?: Date;

    @ApiProperty({ description: 'Event location', required: false })
    @IsOptional()
    @IsString()
    location?: string;

    @ApiProperty({ type: [AttachmentDto], description: 'Attached media files' })
    @IsArray()
    @Type(() => AttachmentDto)
    attachments: AttachmentDto[];

    @ApiProperty({
        enum: ['pending', 'sent', 'snoozed', 'dismissed'],
        description: 'Notification status'
    })
    @IsEnum(['pending', 'sent', 'snoozed', 'dismissed'])
    notificationStatus: 'pending' | 'sent' | 'snoozed' | 'dismissed';
}