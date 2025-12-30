import axios from 'axios';

export interface SystemSettings {
    system_name: string;
    system_logo: string;
    payment_pesapal_enabled: boolean;
    payment_offline_enabled: boolean;
    contact_email?: string;
    contact_phone?: string;
    contact_whatsapp?: string;
    contact_address?: string;
}

const API_Base = import.meta.env.VITE_API_BASE_URL || 'http://localhost/byms/api';

export const settingsService = {
    async getSettings(): Promise<SystemSettings> {
        const response = await axios.get<SystemSettings>(`${API_Base}/settings.php`);
        // If logo is a relative path (e.g., uploads/...), prepend base URL if needed.
        // The PHP API returns paths relative to root or as full URLs.
        // If it starts with 'uploads/', it's relative to server root.

        const settings = response.data;
        if (settings.system_logo && !settings.system_logo.startsWith('http')) {
            // Assuming API_Base is .../api, we need parent of api
            const baseUrl = API_Base.replace(/\/api$/, '');
            settings.system_logo = `${baseUrl}/${settings.system_logo}`;
        }

        return settings;
    }
};
