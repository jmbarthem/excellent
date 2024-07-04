<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Pedido;
use App\Models\Produto;
use App\Models\Cliente;

class PedidoController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Pedido::with('cliente', 'produtos')->get();
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'cliente_id' => 'required|exists:clientes,id',
            'produtos' => 'required|array',
            'produtos.*.id' => 'required|exists:produtos,id',
            'produtos.*.quantidade' => 'required|integer|min:1',
            'produtos.*.valor_venda' => 'required|numeric'
        ]);

        $pedido = Pedido::create([
            'cliente_id' => $validatedData['cliente_id'],
            'total' => collect($validatedData['produtos'])->sum(function ($produto) {
                return $produto['valor_venda'] * $produto['quantidade'];
            })
        ]);

        foreach ($validatedData['produtos'] as $produto) {
            $pedido->produtos()->attach($produto['id'], [
                'quantidade' => $produto['quantidade'],
                'valor_venda' => $produto['valor_venda'],
                'subtotal' => $produto['valor_venda'] * $produto['quantidade']
            ]);
        }

        return response()->json($pedido->load('cliente', 'produtos'), 201);
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        return Pedido::with('cliente', 'produtos')->findOrFail($id);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $validatedData = $request->validate([
            'cliente_id' => 'required|exists:clientes,id',
            'produtos' => 'required|array',
            'produtos.*.id' => 'required|exists:produtos,id',
            'produtos.*.quantidade' => 'required|integer|min:1',
            'produtos.*.valor_venda' => 'required|numeric',
        ]);

        $pedido = Pedido::findOrFail($id);

        $pedido->update(['cliente_id' => $validatedData['cliente_id']]);

        $pedido->produtos()->detach();

        $total = 0;
        foreach ($validatedData['produtos'] as $produto) {
            $total += $produto['valor_venda'] * $produto['quantidade'];
            $pedido->produtos()->attach($produto['id'], [
                'quantidade' => $produto['quantidade'],
                'valor_venda' => $produto['valor_venda'],
                'subtotal' => $produto['valor_venda'] * $produto['quantidade']
            ]);
        }

        $pedido->update(['total' => $total]);

        return response()->json($pedido->load('cliente', 'produtos'), 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $pedido = Pedido::findOrFail($id);
        $pedido->delete();
        return response()->json(null, 204);
    }
}
