use rocket::FromForm;
use rocket::serde::{Deserialize, Serialize};

use uuid::Uuid;

pub struct Model {
    pub id: String,
    pub name: String
}

#[derive(Serialize, Debug)]
pub struct ViewModel {
    pub id: String,
    pub name: String
}

#[derive(Serialize, Deserialize)]
#[serde(crate = "rocket::serde")]
pub struct PostModel {
    pub name: String
}

#[derive(Serialize, Deserialize)]
#[serde(crate = "rocket::serde")]
pub struct PutModel {
    pub id: String,
    pub name: String
}

impl Model {
    pub fn new(name: String) -> Model {
        Model {
            id: Uuid::new_v4().to_string(),
            name
        }
    }
}

impl ViewModel {
    pub fn new(id: String, name: String) -> ViewModel {
        ViewModel { id, name }
    }
}

impl From<Model> for ViewModel {
    fn from(model: Model) -> Self {
        ViewModel {
            id: model.id,
            name: model.name
        }
    }
}

impl From<PostModel> for Model {
    fn from(model: PostModel) -> Self {
        Model {
            id: Uuid::new_v4().to_string(),
            name: model.name
        }
    }
}

impl From<PutModel> for Model {
    fn from(model: PutModel) -> Self {
        Model {
            id: model.id,
            name: model.name
        }
    }
}
