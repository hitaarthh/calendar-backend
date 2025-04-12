export interface Attachment {
    type: 'image' | 'video';
    url: string;
    name: string;
}

export interface Event {
    id: string;
    title: string;
    description: string;
    startDate: Date;
    endDate?: Date;
    location?: string;
    attachments: Attachment[];
    notificationStatus: 'pending' | 'sent' | 'snoozed' | 'dismissed';
    createdAt: Date;
    updatedAt: Date;
}
