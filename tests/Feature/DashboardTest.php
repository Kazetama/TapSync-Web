<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;


class DashboardTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Test: Guest harus diredirect ke login.
     */
    public function test_guests_are_redirected_to_the_login_page(): void
    {
        $response = $this->get(route('dashboard'));
        $response->assertRedirect(route('login'));
    }

    /**
     * Test: User biasa mengakses dashboard umum.
     * (Sesuai web.php kamu yang punya middleware 'user' di route 'dashboard')
     */
    public function test_regular_user_can_access_dashboard(): void
    {
        /** @var User $user */
        $user = User::factory()->create(['usertype' => 'user']);
        $response = $this->actingAs($user)->get(route('dashboard'));
        $response->assertStatus(200);
    }

    /**
     * Test: Admin mengakses dashboard admin.
     * Diasumsikan ada route 'admin.dashboard' di dalam auth/admin.php
     */
    public function test_admin_can_access_dashboard(): void
    {
        /** @var User $user */
        $user = User::factory()->create(['usertype' => 'admin']);
        $response = $this->actingAs($user)->get(route('admin.dashboard'));
        $response->assertStatus(200);
    }

    /**
     * Test: Superadmin mengakses dashboard superadmin.
     */
    public function test_superadmin_can_access_dashboard(): void
    {
        /** @var User $user */
        $user = User::factory()->create(['usertype' => 'superadmin']);
        $response = $this->actingAs($user)->get(route('superadmin.dashboard'));
        $response->assertStatus(200);
    }

    /**
     * Test: Proteksi Silang (Cross-Access Protection).
     * Admin TIDAK BOLEH bisa masuk ke dashboard Superadmin.
     */
    public function test_admin_cannot_access_superadmin_dashboard(): void
    {
        /** @var User $admin */
        $admin = User::factory()->create(['usertype' => 'admin']);
        $response = $this->actingAs($admin)->get(route('superadmin.dashboard'));
        $response->assertStatus(302);
    }
}