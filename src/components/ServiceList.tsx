import React from 'react';
import { Clock, DollarSign } from 'lucide-react';
import { Service } from '../types';

interface ServiceListProps {
  services: Service[];
  selectedService: Service | null;
  onServiceSelect: (service: Service) => void;
}

export function ServiceList({ services, selectedService, onServiceSelect }: ServiceListProps) {
  return (
    <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
      {services.map((service) => (
        <div
          key={service.id}
          className={`p-4 rounded-lg border cursor-pointer transition-all
            ${
              selectedService?.id === service.id
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-blue-300'
            }`}
          onClick={() => onServiceSelect(service)}
        >
          <h3 className="font-semibold text-lg mb-2">{service.name}</h3>
          <p className="text-gray-600 text-sm mb-4">{service.description}</p>
          
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center text-gray-500">
              <Clock className="w-4 h-4 mr-1" />
              <span>{service.duration} min</span>
            </div>
            <div className="flex items-center text-gray-500">
              <DollarSign className="w-4 h-4 mr-1" />
              <span>${service.price}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}