use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct BasicEntity {
    id: String,
    name: String,
    description: String,
    entity_type: String,
    created_at: i64,
    updated_at: i64,
}

impl BasicEntity {
    pub fn new(
        id: String,
        name: String,
        description: String,
        entity_type: String,
        created_at: i64,
        updated_at: i64,
    ) -> BasicEntity {
        BasicEntity {
            id,
            name,
            description,
            entity_type,
            created_at,
            updated_at,
        }
    }

    pub fn get_id(&self) -> String {
        String::from(&self.id)
    }

    pub fn get_name(&self) -> String {
        String::from(&self.name)
    }

    pub fn get_description(&self) -> String {
        String::from(&self.description)
    }

    pub fn get_entity_type(&self) -> String {
        String::from(&self.entity_type)
    }

    pub fn get_created_at(&self) -> i64 {
        self.created_at
    }

    pub fn get_updated_at(&self) -> i64 {
        self.updated_at
    }
}
