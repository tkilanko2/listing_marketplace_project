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
                ? 'border-[#3D1560] bg-[#EDD9FF]'
                : 'border-[#CDCED8] hover:border-[#6D26AB]'
            }`}
          onClick={() => onServiceSelect(service)}
        >
          <h3 className="font-semibold text-lg mb-2 text-[#1B1C20]">{service.name}</h3>
          <p className="text-[#70727F] text-sm mb-4">{service.description}</p>
          
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center text-[#70727F]">
              <Clock className="w-4 h-4 mr-1 text-[#3D1560]" />
              <span>{service.duration} min</span>
            </div>
            <div className="flex items-center text-[#70727F]">
              <DollarSign className="w-4 h-4 mr-1 text-[#3D1560]" />
              <span>${service.price}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}