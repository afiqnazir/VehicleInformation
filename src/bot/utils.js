function formatDate(dateString) {
  if (!dateString) return 'N/A';
  try {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  } catch {
    return dateString;
  }
}

export function formatVehicleDetails(vehicle) {
  const sections = [
    {
      title: '🚗 Basic Information',
      items: [
        ['Registration Number', vehicle.registrationNumber],
        ['Make & Model', `${vehicle.brand?.make_display || 'N/A'} ${vehicle.model?.model_display || ''}`],
        ['Variant', vehicle.ds_details?.[0]?.variant?.variant_display_name || 'N/A'],
        ['Registration Date', formatDate(vehicle.registeredAt)],
        ['Registered At', vehicle.registeredPlace],
        ['Owner Name', vehicle.rc_owner_name || vehicle.rc_owner_name_masked],
      ]
    },
    {
      title: '🔧 Vehicle Specifications',
      items: [
        ['Vehicle Class', vehicle.vehicleClassDesc],
        ['Fuel Type', vehicle.fuelType],
        ['Color', vehicle.color],
        ['Seating Capacity', `${vehicle.seatCap} seats`],
        ['Body Type', vehicle.full_details?.bodyType || 'N/A'],
        ['Transmission', vehicle.ds_details?.[0]?.variant?.transmission_type || vehicle.full_details?.transmission || 'N/A'],
      ]
    },
    {
      title: '⚙️ Engine Details',
      items: [
        // Only show unmasked engine number
        ['Engine Number', vehicle.engineNo?.includes('X') ? vehicle.full_details?.engineNo : vehicle.engineNo],
        ['Chassis Number', vehicle.chassisNoFull || vehicle.chassisNo],
        ['Cubic Capacity', `${vehicle.full_details?.cubicCap || 'N/A'} cc`],
        ['No. of Cylinders', vehicle.full_details?.noOfCylinder || 'N/A'],
      ]
    },
    {
      title: '📋 Insurance & Compliance',
      items: [
        ['Insurance Company', vehicle.insuranceCompany],
        ['Policy Number', vehicle.insurancePolicyNo],
        ['Valid Till', formatDate(vehicle.insuranceUpTo)],
        ['RC Status', vehicle.rcStatus],
        ['Fitness Valid Till', formatDate(vehicle.fitnessUpTo)],
        ['PUC Valid Till', formatDate(vehicle.pucUpTo)],
      ]
    },
    {
      title: '💰 Finance Information',
      items: [
        ['Hypothecation', vehicle.hypothecation ? 'Yes' : 'No'],
        ['Financier', vehicle.financier || 'N/A'],
        ['Commercial Vehicle', vehicle.isCommercial ? 'Yes' : 'No'],
      ]
    },
  ];

  return sections
    .map(section => {
      const items = section.items
        .map(([label, value]) => `${label}: <b>${value}</b>`)
        .join('\n');
      return `\n${section.title}\n${items}`;
    })
    .join('\n\n');
}