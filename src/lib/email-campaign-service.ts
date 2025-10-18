import type { EmailCampaign } from './types';

// In-memory store for campaigns, acting as a cache for localStorage
let campaigns: EmailCampaign[] | null = null;
const CAMPAIGNS_STORAGE_KEY = 'nexus-talent-campaigns';

const loadCampaigns = (): EmailCampaign[] => {
    // If cache is populated, return it
    if (campaigns) {
        return campaigns;
    }

    // If running on server, return empty array
    if (typeof window === 'undefined') {
        return [];
    }
    
    try {
        const storedCampaigns = localStorage.getItem(CAMPAIGNS_STORAGE_KEY);
        if (storedCampaigns) {
            // Parse stored data and populate cache
            const parsed = JSON.parse(storedCampaigns);
            // Ensure dates are converted back to Date objects
            campaigns = parsed.map((c: any) => ({ ...c, sentDate: new Date(c.sentDate) }));
            return campaigns!;
        } else {
            // No stored data, initialize empty array
            campaigns = [];
            localStorage.setItem(CAMPAIGNS_STORAGE_KEY, JSON.stringify(campaigns));
            return campaigns;
        }
    } catch (error) {
        console.error("Failed to load campaigns from localStorage, starting fresh:", error);
        // On error, fallback to empty array
        campaigns = [];
        return campaigns;
    }
};

const saveCampaigns = (newCampaigns: EmailCampaign[]): void => {
    campaigns = newCampaigns;
    if (typeof window !== 'undefined') {
        try {
            localStorage.setItem(CAMPAIGNS_STORAGE_KEY, JSON.stringify(newCampaigns));
        } catch (error) {
            console.error("Failed to save campaigns to localStorage:", error);
        }
    }
};


// Function to get all campaigns
export const getCampaigns = (): EmailCampaign[] => {
    const allCampaigns = loadCampaigns();
    // Sort by most recent first
    return [...allCampaigns].sort((a, b) => b.sentDate.getTime() - a.sentDate.getTime());
};


// Function to add a new campaign
export const addCampaign = (campaignData: Omit<EmailCampaign, 'id' | 'sentDate'>): EmailCampaign[] => {
    const currentCampaigns = getCampaigns();
    
    const newCampaign: EmailCampaign = {
        ...campaignData,
        id: `campaign-${new Date().getTime()}`,
        sentDate: new Date(),
    };
    
    const newCampaignsList = [newCampaign, ...currentCampaigns];
    saveCampaigns(newCampaignsList);
    
    return newCampaignsList;
};

// Function to delete a campaign (to be used in the future)
export const deleteCampaign = (id: string): void => {
    const currentCampaigns = getCampaigns();
    const newCampaigns = currentCampaigns.filter(c => c.id !== id);
    saveCampaigns(newCampaigns);
};
