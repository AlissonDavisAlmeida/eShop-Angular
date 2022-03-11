const express = require("express")
const rotaCategorias = express.Router()

const Categorias = require("../models/Categoria")




rotaCategorias.get(`/`,(req, res)=>{

    Categorias.find().then(categorias=>{
        if(!categorias){
            return res.status(500).json({
                mensagem: "Não foram encontradas categorias"
            })
        }

        res.status(200).json({
            categorias
        })
    }).catch(err=>{
        console.log(err)
    })
})

rotaCategorias.get("/:id",(req, res)=>{
    const {id} = req.params

    Categorias.findById({_id : id}).then((retorno)=>{
       
        if(!retorno){
            return res.status(500).json({
                mensagem:"Não foi encontrada nenhuma categoria com o ID passado"
            })
        }
        return res.status(200).json({
            retorno
        })
    }, (erro)=>{
        console.log(erro)
    })
})

rotaCategorias.post("/", async (req, res)=>{
    const categoria = new Categorias({
        nome : req.body.nome,
        icone: req.body.icone,
        cor: req.body.cor
    })
    const retornoCategoria = await categoria.save()

    if(!retornoCategoria){
        return res.status(404).json({
            mensagem : "Ocorreu um erro na criação da categoria"
        })
    }
    res.status(200).json({
        retornoCategoria,
        mensagem : "Categoria salva com sucesso"
    })
})

rotaCategorias.put("/:id", (req, res)=>{

    const {name, icon, color} = req.body
    const{id} = req.params

    Categorias.findByIdAndUpdate({_id : id},{name : name, icon : icon, color : color},{new:true}).then((retorno)=>{

        if(!retorno){
            res.status(500).json({mensagem : "Não foi possível atualizar "})
        }
        res.status(200).json({
            mensagem : "Atualizado com sucesso",
            retorno
        })
    }, (erro)=>{
        res.status(500).json({
            mensagem:"Ocorreu um erro",
            erro
        })
    })


})

rotaCategorias.delete("/:id", (req, res)=>{
    Categorias.findByIdAndRemove(req.params.id).then(categoria =>{
        if(categoria){
            return res.status(200).json({
                mensagem : "Categoria removida com sucesso",
                categorias
            })
        }else{
            return res.status(404).json({
                mensagem:"Ocorreu um erro na remoção da categoria"
            })
        }
    }).catch(erro =>{
        return res.status(400).json({
            mensagem : "ocorreu um erro",
            erro
        })
    })
})

module.exports = rotaCategorias