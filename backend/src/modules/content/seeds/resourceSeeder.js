import { Resource } from '../schemas/resource.schema';
import { curatedResources } from './curatedResources';

export async function seedResources() {
    try {
        // Clear existing resources
        await Resource.deleteMany({});

        // Insert curated resources
        await Resource.insertMany(curatedResources);

        console.log('Resources seeded successfully');
    } catch (error) {
        console.error('Error seeding resources:', error);
    }
} 