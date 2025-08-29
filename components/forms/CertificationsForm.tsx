'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Certification } from '@/types/resume';
import { Plus, Trash2, Award } from 'lucide-react';

interface CertificationsFormProps {
  certifications: Certification[];
  onUpdate: (certifications: Certification[]) => void;
}

export function CertificationsForm({ certifications, onUpdate }: CertificationsFormProps) {
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  const addCertification = () => {
    const newCertification: Certification = {
      id: Date.now().toString(),
      name: '',
      issuer: '',
      date: '',
      dateObtained: '',
      expirationDate: '',
      credentialId: '',
      url: ''
    };
    onUpdate([...certifications, newCertification]);
    setExpandedItems([...expandedItems, newCertification.id]);
  };

  const removeCertification = (id: string) => {
    onUpdate(certifications.filter(cert => cert.id !== id));
    setExpandedItems(expandedItems.filter(itemId => itemId !== id));
  };

  const updateCertification = (id: string, updates: Partial<Certification>) => {
    onUpdate(certifications.map(cert => 
      cert.id === id ? { ...cert, ...updates } : cert
    ));
  };

  const toggleExpanded = (id: string) => {
    setExpandedItems(prev =>
      prev.includes(id)
        ? prev.filter(itemId => itemId !== id)
        : [...prev, id]
    );
  };

  return (
    <div className="space-y-4">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Certifications</h3>
        <p className="text-sm text-gray-600">Add your professional certifications and credentials</p>
      </div>
      
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Award className="h-5 w-5 text-purple-600" />
          <span className="font-medium text-gray-700">Certifications ({certifications.length})</span>
        </div>
        <Button 
          onClick={addCertification} 
          className="bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 shadow-lg hover:shadow-xl transition-all duration-200 rounded-lg px-4 py-2"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Certification
        </Button>
      </div>

      {certifications.length === 0 ? (
        <Card className="border-dashed border-2 border-gray-200 bg-gray-50/50">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Award className="h-12 w-12 text-gray-400 mb-4" />
            <p className="text-gray-500 mb-4">No certifications added yet</p>
            <Button 
              onClick={addCertification} 
              className="bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 shadow-lg hover:shadow-xl transition-all duration-200 rounded-lg"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Your First Certification
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {certifications.map((cert) => (
            <Card key={cert.id} className="transition-all duration-200">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">
                    {cert.name || 'New Certification'} {cert.issuer && `by ${cert.issuer}`}
                  </CardTitle>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleExpanded(cert.id)}
                    >
                      {expandedItems.includes(cert.id) ? 'Collapse' : 'Expand'}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeCertification(cert.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>

              {expandedItems.includes(cert.id) && (
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor={`name-${cert.id}`}>Certification Name *</Label>
                    <Input
                      id={`name-${cert.id}`}
                      value={cert.name}
                      onChange={(e) => updateCertification(cert.id, { name: e.target.value })}
                      placeholder="AWS Certified Solutions Architect"
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor={`issuer-${cert.id}`}>Issuing Organization *</Label>
                    <Input
                      id={`issuer-${cert.id}`}
                      value={cert.issuer}
                      onChange={(e) => updateCertification(cert.id, { issuer: e.target.value })}
                      placeholder="Amazon Web Services"
                      className="mt-1"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor={`date-${cert.id}`}>Date Obtained</Label>
                      <Input
                        id={`date-${cert.id}`}
                        type="month"
                        value={cert.date || cert.dateObtained || ''}
                        onChange={(e) => updateCertification(cert.id, { date: e.target.value, dateObtained: e.target.value })}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor={`expirationDate-${cert.id}`}>Expiration Date (Optional)</Label>
                      <Input
                        id={`expirationDate-${cert.id}`}
                        type="month"
                        value={cert.expirationDate || ''}
                        onChange={(e) => updateCertification(cert.id, { expirationDate: e.target.value })}
                        className="mt-1"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor={`credentialId-${cert.id}`}>Credential ID (Optional)</Label>
                      <Input
                        id={`credentialId-${cert.id}`}
                        value={cert.credentialId || ''}
                        onChange={(e) => updateCertification(cert.id, { credentialId: e.target.value })}
                        placeholder="ABC123DEF456"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor={`url-${cert.id}`}>Certificate URL (Optional)</Label>
                      <Input
                        id={`url-${cert.id}`}
                        value={cert.url || ''}
                        onChange={(e) => updateCertification(cert.id, { url: e.target.value })}
                        placeholder="https://..."
                        className="mt-1"
                      />
                    </div>
                  </div>
                </CardContent>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}