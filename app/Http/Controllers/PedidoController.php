<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Pedido;
use App\Models\Produto;
use App\Models\Cliente;
use Illuminate\Support\Facades\Log;

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
        Log::info('Dados recebidos para inserção:', $request->all());

        try {
            $validatedData = $request->validate([
                'cliente_id' => 'required|exists:clientes,id',
                'produtos' => 'required|array',
                'produtos.*.produto_id' => 'required|exists:produtos,id',
                'produtos.*.quantidade' => 'required|integer|min:1',
                'produtos.*.valor_venda' => 'required|numeric|min:0',
                'produtos.*.subtotal' => 'required|numeric|min:0',
                'total' => 'required|numeric|min:0',
            ]);

            Log::info('Dados validados:', $validatedData);

            $pedido = Pedido::create([
                'cliente_id' => $validatedData['cliente_id'],
                'total' => $validatedData['total'],
            ]);

            foreach ($validatedData['produtos'] as $produtoData) {
                $pedido->produtos()->attach($produtoData['produto_id'], [
                    'quantidade' => $produtoData['quantidade'],
                    'valor_venda' => $produtoData['valor_venda'],
                    'subtotal' => $produtoData['subtotal'],
                ]);
            }

            return response()->json($pedido->load('produtos'), 201);

        } catch (\Illuminate\Validation\ValidationException $e) {
            Log::error('Erro de validação:', $e->errors());
            return response()->json(['errors' => $e->errors()], 422);
        } catch (\Exception $e) {
            Log::error('Erro ao criar pedido:', ['message' => $e->getMessage()]);
            return response()->json(['message' => 'Erro ao criar pedido'], 500);
        }
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
