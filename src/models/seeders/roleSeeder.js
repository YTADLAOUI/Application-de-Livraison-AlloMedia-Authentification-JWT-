const { roleModel } = require("../role.js");

const rolesToSeed = [
  { name: 'Client' },
  { name: 'Livreur' },
  { name: 'Administrateur' }
];

const seedRoles = async () => {
  try {
   
    
    // Insérez les nouveaux rôles
    
    
    // 
    
    await roleModel.insertMany(rolesToSeed, { w: 1, j: true, wtimeout: 5000 });

    console.log('Rôles insérés avec succès.');
  } catch (error) {
    console.error("Erreur lors de l'insertion des rôles :", error);
  }
};

seedRoles();