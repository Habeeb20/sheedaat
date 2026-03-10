// controllers/serviceController.js
import Service from '../models/Services.js';
import cache from '../cache.js';


const SERVICES_LIST_KEY = 'services:all';

export const createService = async (req, res) => {
        const user = req.user._id
  try {
    const { name, description, media } = req.body;

    const service = new Service({user, name, description, media });
    await service.save();

    cache.del(SERVICES_LIST_KEY);

    res.status(201).json({ message: 'Service created', service });
  } catch (error) {
    res.status(400).json({ message: 'Error creating service', error: error.message });
  }
};

export const getAllServices = async (req, res) => {
  try {
    let services = cache.get(SERVICES_LIST_KEY);

    if (services) {
      console.log('📦 Cache HIT: services list');
      return res.json(services);
    }

    console.log('💾 Cache MISS: fetching services');
    services = await Service.find().sort({ updatedAt: -1 }).lean();

    cache.set(SERVICES_LIST_KEY, services);

    res.json(services);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching services', error: error.message });
  }
};

export const getServiceById = async (req, res) => {
  try {
    const { id } = req.params;
    const cacheKey = `service:${id}`;

    let service = cache.get(cacheKey);

    if (service) {
      console.log(`📦 Cache HIT: ${cacheKey}`);
      return res.json(service);
    }

    console.log(`💾 Cache MISS: ${cacheKey}`);
    service = await Service.findById(id).lean();

    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

    cache.set(cacheKey, service, 3600);

    res.json(service);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching service', error: error.message });
  }
};

export const updateService = async (req, res) => {
        const user = req.user._id
  try {
    const { id } = req.params;
    const updates = req.body;

    const service = await Service.findByIdAndUpdate(id, updates, { new: true, runValidators: true });

    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

    cache.del(`service:${id}`);
    cache.del(SERVICES_LIST_KEY);

    res.json({ message: 'Service updated', service });
  } catch (error) {
    res.status(400).json({ message: 'Error updating service', error: error.message });
  }
};

export const deleteService = async (req, res) => {
  try {
    const { id } = req.params;

    const service = await Service.findByIdAndDelete(id);

    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

    cache.del(`service:${id}`);
    cache.del(SERVICES_LIST_KEY);

    res.json({ message: 'Service deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting service', error: error.message });
  }
};